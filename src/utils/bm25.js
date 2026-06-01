// Lightweight BM25 implementation for client-side search
class BM25 {
  constructor(docs = [], options = {}) {
    this.k1 = options.k1 ?? 1.5;
    this.b = options.b ?? 0.75;
    this.docs = docs.map(d => ({ id: d.id, title: d.title || '', text: d.text || '', len: this._tokenize(d.text).length }));
    this.N = this.docs.length;
    this.avgdl = this.docs.reduce((s, d) => s + d.len, 0) / Math.max(1, this.N);
    this.docFreqs = {}; // term -> doc freq
    this.termFreqs = {}; // docId -> {term: tf}

    this.docs.forEach(doc => {
      const tokens = this._tokenize(doc.text);
      const freqs = {};
      tokens.forEach(t => freqs[t] = (freqs[t] || 0) + 1);
      this.termFreqs[doc.id] = freqs;
      Object.keys(freqs).forEach(t => this.docFreqs[t] = (this.docFreqs[t] || 0) + 1);
    });
  }

  _tokenize(text = '') {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s'-]+/gu, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  _idf(term) {
    const df = this.docFreqs[term] || 0;
    // add-one smoothing variant
    return Math.log(1 + (this.N - df + 0.5) / (df + 0.5));
  }

  search(query, topN = 10) {
    if (!query || typeof query !== 'string') return [];
    const qTerms = this._tokenize(query);
    if (qTerms.length === 0) return [];

    const scores = {};
    this.docs.forEach(doc => {
      let score = 0;
      const freqs = this.termFreqs[doc.id] || {};
      qTerms.forEach(term => {
        const tf = freqs[term] || 0;
        if (tf === 0) return;
        const idf = this._idf(term);
        const denom = tf + this.k1 * (1 - this.b + this.b * (doc.len / this.avgdl));
        score += idf * ((tf * (this.k1 + 1)) / denom);
      });
      if (score > 0) scores[doc.id] = score;
    });

    const results = Object.keys(scores)
      .map(id => ({ id, score: scores[id] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);

    return results;
  }
}

export default BM25;
