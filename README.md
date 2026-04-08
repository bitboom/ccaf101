# CCAF 101

Claude Certified Architect - Foundations (CCAF) 시험 준비를 위한 한국어 학습 위키입니다. [Quartz](https://quartz.jzhao.xyz/)로 호스팅됩니다.

## Structure

- `content/`: Obsidian-compatible markdown wiki pages
  - `concepts/`: 28개 개념 문서 (도메인을 가로지르는 판단 축)
  - `domains/`: 5개 도메인 문서 (시험 범위별 정리)
- `quartz.config.ts`: Quartz 사이트 설정
- `.github/workflows/pages.yml`: GitHub Pages 배포

## Local development

```bash
npm install
npx quartz build
npx http-server public
```

## Site

https://bitboom.github.io/ccaf101/
