import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";

export const dynamic = 'force-dynamic';

interface LetterboxdItem {
    filmTitle?: string;
    filmYear?: string;
    memberRating?: string;
    title?: string;
    tmdbId?: string;
}

const TMDB_TOKEN = process.env.TMDB_TOKEN;

// Configure the RSS parser to handle Letterboxd custom namespaces
const parser = new Parser({
    customFields: {
        item: [
            ['letterboxd:filmTitle', 'filmTitle'],
            ['letterboxd:filmYear', 'filmYear'],
            ['letterboxd:memberRating', 'memberRating'],
            ['tmdb:movieId', 'tmdbId'],
        ],
    },
});

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    try {
        const url = `https://letterboxd.com/${username}/rss/`;

        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (response.status === 404) {
            return NextResponse.json(
                { error: `User '${username}' not found or profile is private` },
                { status: 404 }
            );
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to communicate with Letterboxd" },
                { status: 500 }
            );
        }

        const xml = await response.text();
        const feed = await parser.parseString(xml);

        // Map to Film interface with TMDB enrichment
        const films = await Promise.all(feed.items.map(async (item, index) => {
            const lbItem = item as unknown as LetterboxdItem;
            const ratingValue = lbItem.memberRating;
            const stars = ratingValue ? `${ratingValue}/5.0` : "UNRATED";

            const details = {
                genres: "WATCHED",
                director: "UNKNOWN DIR.",
                duration: "00:00"
            };

            if (TMDB_TOKEN && lbItem.tmdbId) {
                try {
                    const tmdbResp = await fetch(
                        `https://api.themoviedb.org/3/movie/${lbItem.tmdbId}?append_to_response=credits`,
                        {
                            headers: {
                                Authorization: `Bearer ${TMDB_TOKEN}`,
                                Accept: 'application/json'
                            },
                            next: { revalidate: 3600 * 24 } // Cache for 24 hours
                        }
                    );
                    if (tmdbResp.ok) {
                        const data = await tmdbResp.json();

                        // Parse Runtime
                        if (data.runtime) {
                            const hours = Math.floor(data.runtime / 60);
                            const mins = data.runtime % 60;
                            details.duration = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
                        }

                        // Parse Director
                        const director = data.credits?.crew?.find((c: { job: string; name: string }) => c.job === 'Director');
                        if (director) {
                            details.director = director.name.toUpperCase();
                        }

                        // Parse Genres
                        if (data.genres && data.genres.length > 0) {
                            details.genres = data.genres.map((g: { name: string }) => g.name.toUpperCase()).join(", ");
                        }
                    }
                } catch (err) {
                    console.error(`Failed to fetch TMDB data for ${lbItem.tmdbId}`, err);
                }
            }

            return {
                id: index + 1,
                title: (lbItem.filmTitle || lbItem.title || "Unknown Title").toUpperCase(),
                ...details,
                year: lbItem.filmYear || "XXXX",
                rating: stars,
            };
        }));

        return NextResponse.json(films);

    } catch (error) {
        console.error("Fetch bill error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while fetching the bill" },
            { status: 500 }
        );
    }
}
