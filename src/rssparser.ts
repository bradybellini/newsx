import { parseFeed } from "https://deno.land/x/rss/mod.ts";
import { FeedEntry } from "https://deno.land/x/rss@0.5.6/src/types/feed.ts";
import { createHash } from "https://deno.land/std@0.91.0/hash/mod.ts";

export class RSSParser {
  private getArticleInfo(
    feed_id: string,
    entry: FeedEntry
  ): Record<string, unknown> {
    const tags = <string[]>[];
    entry.categories?.forEach((tag) => {
      if (tag.term) {
        tags.push(tag.term);
      }
    });
    // const date: Date | null = entry.published ? entry.published : null;

    const articleEntry = {
      feed_id: feed_id,
      title: entry.title?.value,
      link: entry.links[0].href,
      author: entry.author?.name ? entry.author?.name : null,
      published: entry.published ? entry.published : null,
      summary: entry.description?.value
        ? entry.description?.value?.replace(/<\/?[^>]+(>|$)/g, "").trim()
        : null,
      guid: entry.id,
      uid: createHash("md5")
        .update("${entry.title?.value}" + "${entry.links[0].href}")
        .toString(),
      tags: tags,
    };

    return articleEntry;
  }

  private async fetchFeed(feed: string): Promise<FeedEntry[]> {
    const response = await fetch(feed, {
      method: "GET",
    });
    const rawFeed = await response.text();
    const { entries } = await parseFeed(rawFeed);

    return entries;
  }

  public async articles(feed: string, feed_id: string) {
    const feedArticles = <Record<string, unknown>[]>[];
    try {
        const f = await this.fetchFeed(feed);
        f.forEach((entry) => {
            feedArticles.push(this.getArticleInfo(feed_id, entry));
          });
    } catch (error) {
        console.log(error);
        throw error;
    }

    return feedArticles;
  }
}
