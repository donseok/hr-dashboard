import numpy as np
from datetime import datetime, timezone

from core.logging import get_logger
from models.sentiment.config import (
    POSITIVE_KEYWORDS,
    NEGATIVE_KEYWORDS,
    ASPECT_KEYWORDS,
    MODEL_VERSION,
)
from models.sentiment.preprocessor import TextPreprocessor
from schemas.prediction import SentimentResult

logger = get_logger(__name__)


class SentimentModel:
    """
    Korean sentiment analysis model.

    Simulates KoBERT-style classification using a keyword-based rule engine
    with weighted sentiment dictionaries and aspect-based analysis.
    """

    VERSION = MODEL_VERSION
    MODEL_TYPE = "rule_engine"
    FRAMEWORK = "kobert_simulation"

    def __init__(self):
        self.preprocessor = TextPreprocessor()
        self._is_loaded = True
        logger.info(f"SentimentModel v{self.VERSION} initialized (keyword-based)")

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded

    def predict(self, text: str, language: str = "ko") -> SentimentResult:
        """Analyze sentiment of input text."""
        tokens = self.preprocessor.preprocess(text, language)
        bigrams = self.preprocessor.extract_ngrams(tokens, 2)
        all_tokens = set(tokens + bigrams)

        # Score calculation
        pos_score, pos_matches = self._match_keywords(all_tokens, text.lower(), POSITIVE_KEYWORDS)
        neg_score, neg_matches = self._match_keywords(all_tokens, text.lower(), NEGATIVE_KEYWORDS)

        # Normalize scores
        total = abs(pos_score) + abs(neg_score) + 0.1  # avoid division by zero
        positive_ratio = abs(pos_score) / total
        negative_ratio = abs(neg_score) / total
        neutral_ratio = 1.0 - positive_ratio - negative_ratio
        neutral_ratio = max(0, neutral_ratio)

        # Adjust: if no strong signals, lean neutral
        if len(pos_matches) == 0 and len(neg_matches) == 0:
            positive_ratio = 0.2
            negative_ratio = 0.1
            neutral_ratio = 0.7

        # Overall sentiment
        overall_score = (pos_score + neg_score) / max(len(tokens), 1)
        overall_score = float(np.clip(overall_score, -1, 1))

        if overall_score > 0.1:
            sentiment = "positive"
        elif overall_score < -0.1:
            sentiment = "negative"
        else:
            sentiment = "neutral"

        # Aspect analysis
        aspects = self._analyze_aspects(tokens, text.lower(), language)

        # Confidence based on keyword density
        keyword_density = (len(pos_matches) + len(neg_matches)) / max(len(tokens), 1)
        confidence = float(np.clip(0.5 + keyword_density * 2, 0.4, 0.95))

        # Collected keywords
        keywords = list(pos_matches | neg_matches)[:10]

        return SentimentResult(
            sentiment=sentiment,
            score=round(overall_score, 4),
            confidence=round(confidence, 4),
            positive_score=round(positive_ratio, 4),
            neutral_score=round(neutral_ratio, 4),
            negative_score=round(negative_ratio, 4),
            keywords=keywords,
            aspects=aspects,
            predicted_at=datetime.now(timezone.utc),
        )

    def _match_keywords(
        self, tokens: set[str], full_text: str, lexicon: dict[str, float]
    ) -> tuple[float, set[str]]:
        """Match tokens against lexicon and return total score and matched keywords."""
        score = 0.0
        matches = set()
        for keyword, weight in lexicon.items():
            # Check both token match and substring match
            if keyword in tokens or keyword in full_text:
                score += weight
                matches.add(keyword)
        return score, matches

    def _analyze_aspects(self, tokens: list[str], full_text: str, language: str) -> list[dict]:
        """Aspect-based sentiment analysis."""
        aspects = []
        lang_key = "ko" if language == "ko" else "en"

        for aspect_name, keyword_sets in ASPECT_KEYWORDS.items():
            aspect_keywords = keyword_sets.get(lang_key, []) + keyword_sets.get("en", [])
            matched = False
            for kw in aspect_keywords:
                if kw in full_text or kw in tokens:
                    matched = True
                    break

            if not matched:
                continue

            # Determine aspect sentiment from surrounding context
            # Simple: check if more positive or negative keywords near the aspect keyword
            pos_count = sum(1 for kw in POSITIVE_KEYWORDS if kw in full_text)
            neg_count = sum(1 for kw in NEGATIVE_KEYWORDS if kw in full_text)

            if pos_count > neg_count:
                aspect_sentiment = "positive"
                aspect_score = 0.3 + (pos_count / (pos_count + neg_count + 1)) * 0.7
            elif neg_count > pos_count:
                aspect_sentiment = "negative"
                aspect_score = -(0.3 + (neg_count / (pos_count + neg_count + 1)) * 0.7)
            else:
                aspect_sentiment = "neutral"
                aspect_score = 0.0

            aspects.append({
                "aspect": aspect_name,
                "sentiment": aspect_sentiment,
                "score": round(aspect_score, 4),
            })

        return aspects
