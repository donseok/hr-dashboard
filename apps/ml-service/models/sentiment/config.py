"""Korean sentiment lexicon and configuration for rule-based sentiment analysis."""

# ─── Korean Sentiment Dictionary ─────────────────────────
# Simulates KoBERT-style sentiment classification using keyword matching

POSITIVE_KEYWORDS = {
    # Korean
    "좋다": 0.8, "좋은": 0.8, "좋습니다": 0.8, "좋아요": 0.7,
    "만족": 0.9, "만족합니다": 0.9, "만족스럽": 0.8,
    "훌륭": 0.9, "훌륭합니다": 0.9, "훌륭한": 0.9,
    "감사": 0.7, "감사합니다": 0.7,
    "성장": 0.6, "발전": 0.6, "개선": 0.5,
    "협력": 0.7, "협업": 0.7, "팀워크": 0.7,
    "소통": 0.6, "존중": 0.8, "인정": 0.7,
    "유연": 0.6, "자유": 0.5, "자율": 0.6,
    "기회": 0.6, "지원": 0.5, "배움": 0.6,
    "안정": 0.5, "보상": 0.5, "복지": 0.5,
    "리더십": 0.6, "비전": 0.6, "투명": 0.7,
    "즐겁": 0.7, "행복": 0.8, "편안": 0.6,
    "추천": 0.7, "동기부여": 0.7, "열정": 0.6,
    # English
    "great": 0.8, "good": 0.7, "excellent": 0.9, "amazing": 0.9,
    "satisfied": 0.8, "happy": 0.7, "love": 0.8,
    "teamwork": 0.7, "collaboration": 0.7, "supportive": 0.7,
    "growth": 0.6, "opportunity": 0.6, "recognition": 0.7,
    "flexible": 0.6, "innovative": 0.6, "transparent": 0.7,
    "benefits": 0.5, "balance": 0.5, "culture": 0.5,
}

NEGATIVE_KEYWORDS = {
    # Korean
    "불만": -0.8, "불만족": -0.9,
    "부족": -0.6, "부족합니다": -0.6,
    "힘들": -0.7, "어렵": -0.5, "어려운": -0.5,
    "스트레스": -0.7, "과로": -0.8, "야근": -0.7,
    "소통부재": -0.8, "소통없": -0.8,
    "불공정": -0.9, "차별": -0.9,
    "이직": -0.6, "퇴사": -0.7,
    "낮은": -0.5, "부당": -0.8,
    "무시": -0.8, "압박": -0.7,
    "변화없": -0.6, "정체": -0.6,
    "갈등": -0.7, "갈등": -0.7, "갈등": -0.7,
    "불투명": -0.7, "비효율": -0.6,
    "피곤": -0.6, "지친": -0.6,
    # English
    "bad": -0.7, "poor": -0.7, "terrible": -0.9, "awful": -0.9,
    "dissatisfied": -0.8, "unhappy": -0.7, "frustrated": -0.7,
    "stress": -0.7, "overwork": -0.8, "burnout": -0.9,
    "unfair": -0.8, "discrimination": -0.9,
    "micromanagement": -0.8, "toxic": -0.9,
    "workload": -0.5, "pressure": -0.6,
    "turnover": -0.5, "leaving": -0.6,
    "boring": -0.5, "stagnant": -0.6,
}

# ─── Aspect Categories ───────────────────────────────────

ASPECT_KEYWORDS = {
    "leadership": {
        "ko": ["리더십", "관리자", "매니저", "상사", "경영진", "리더", "팀장", "대표"],
        "en": ["leadership", "manager", "management", "boss", "supervisor", "leader", "executive"],
    },
    "culture": {
        "ko": ["문화", "분위기", "환경", "조직문화", "사내문화", "팀문화"],
        "en": ["culture", "atmosphere", "environment", "values", "mission"],
    },
    "compensation": {
        "ko": ["급여", "보상", "연봉", "복지", "혜택", "보너스", "인센티브"],
        "en": ["salary", "compensation", "pay", "benefits", "bonus", "incentive", "perks"],
    },
    "growth": {
        "ko": ["성장", "발전", "기회", "교육", "승진", "커리어", "역량"],
        "en": ["growth", "development", "opportunity", "training", "promotion", "career", "learning"],
    },
    "work_life_balance": {
        "ko": ["워라밸", "야근", "유연근무", "재택", "휴가", "근무시간"],
        "en": ["balance", "overtime", "flexible", "remote", "vacation", "hours", "workload"],
    },
    "teamwork": {
        "ko": ["협업", "팀워크", "소통", "동료", "커뮤니케이션"],
        "en": ["teamwork", "collaboration", "communication", "colleague", "team"],
    },
}

MODEL_VERSION = "1.0.0"
