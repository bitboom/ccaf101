import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/bitboom/ccaf101",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "색인",
      folderDefaultState: "open",
      folderClickBehavior: "collapse",
      useSavedState: true,
      mapFn: (node) => {
        const ko: Record<string, string> = {
          concepts: "개념",
          domains: "도메인",
          "agent-control": "에이전트 제어",
          "tool-design": "도구 설계",
          "state-memory": "상태와 메모리",
          "output-design": "출력 설계",
          "execution-safety": "실행과 안전",
        }
        if (ko[node.slugSegment]) node.displayName = ko[node.slugSegment]
      },
      sortFn: (a, b) => {
        const folderOrder: Record<string, number> = {
          domains: 0,
          concepts: 1,
          "agent-control": 0,
          "tool-design": 1,
          "state-memory": 2,
          "output-design": 3,
          "execution-safety": 4,
        }
        const ao = folderOrder[a.slugSegment] ?? 99
        const bo = folderOrder[b.slugSegment] ?? 99
        if (ao !== bo) return ao - bo
        if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "색인",
      folderDefaultState: "open",
      folderClickBehavior: "collapse",
      useSavedState: true,
      mapFn: (node) => {
        const ko: Record<string, string> = {
          concepts: "개념",
          domains: "도메인",
          "agent-control": "에이전트 제어",
          "tool-design": "도구 설계",
          "state-memory": "상태와 메모리",
          "output-design": "출력 설계",
          "execution-safety": "실행과 안전",
        }
        if (ko[node.slugSegment]) node.displayName = ko[node.slugSegment]
      },
      sortFn: (a, b) => {
        const folderOrder: Record<string, number> = {
          domains: 0,
          concepts: 1,
          "agent-control": 0,
          "tool-design": 1,
          "state-memory": 2,
          "output-design": 3,
          "execution-safety": 4,
        }
        const ao = folderOrder[a.slugSegment] ?? 99
        const bo = folderOrder[b.slugSegment] ?? 99
        if (ao !== bo) return ao - bo
        if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [],
}
