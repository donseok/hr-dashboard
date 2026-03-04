"""
Korean text preprocessor.

Simulates morphological analysis (형태소 분석) without requiring
external NLP libraries like KoNLPy or mecab.
"""

import re


class TextPreprocessor:
    """Preprocessor for Korean and English text."""

    # Common Korean particles and suffixes to strip
    KOREAN_SUFFIXES = [
        "습니다", "입니다", "합니다", "됩니다",
        "는", "은", "를", "을", "가", "이",
        "에서", "에게", "로", "으로", "와", "과",
        "도", "만", "까지", "부터",
        "하다", "하고", "해서", "해요", "했", "하는",
        "적", "스럽", "답", "롭",
    ]

    def preprocess(self, text: str, language: str = "ko") -> list[str]:
        """Tokenize and preprocess text into a list of meaningful tokens."""
        text = text.strip()
        if not text:
            return []

        # Remove special characters, keep Korean, English, spaces
        text = re.sub(r"[^\w\s가-힣a-zA-Z]", " ", text)
        text = re.sub(r"\s+", " ", text).strip()

        tokens = text.lower().split()

        if language == "ko":
            tokens = self._strip_korean_suffixes(tokens)

        # Remove very short tokens
        tokens = [t for t in tokens if len(t) >= 2]

        return tokens

    def _strip_korean_suffixes(self, tokens: list[str]) -> list[str]:
        """Simple suffix stripping for Korean tokens."""
        result = []
        for token in tokens:
            stripped = token
            for suffix in sorted(self.KOREAN_SUFFIXES, key=len, reverse=True):
                if stripped.endswith(suffix) and len(stripped) > len(suffix):
                    stripped = stripped[: -len(suffix)]
                    break
            result.append(stripped)
        return result

    def extract_ngrams(self, tokens: list[str], n: int = 2) -> list[str]:
        """Extract n-grams from token list."""
        if len(tokens) < n:
            return tokens
        ngrams = []
        for i in range(len(tokens) - n + 1):
            ngrams.append("".join(tokens[i : i + n]))
        return tokens + ngrams
