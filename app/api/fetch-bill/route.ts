import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";

export const dynamic = 'force-dynamic';

interface LetterboxdItem {
    filmTitle?: string;
    filmYear?: string;
    memberRating?: string;
    title?: string;
}

// Configure the RSS parser to handle Letterboxd custom namespaces
const parser = new Parser({
    customFields: {
        item: [
            ['letterboxd:filmTitle', 'filmTitle'],
            ['letterboxd:filmYear', 'filmYear'],
            ['letterboxd:memberRating', 'memberRating'],
        ],
    },
});

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const sortBy = searchParams.get("sortBy") || "Highest Rated";

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

        // Convert RSS items
        let processedItems = [...feed.items];

        // Sorting logic
        processedItems = processedItems.sort((a, b) => {
            const dateA = new Date(a.pubDate || 0).getTime();
            const dateB = new Date(b.pubDate || 0).getTime();
            const ratingA = parseFloat((a as unknown as LetterboxdItem).memberRating || "0");
            const ratingB = parseFloat((b as unknown as LetterboxdItem).memberRating || "0");

            if (sortBy === "Lowest Rated") return ratingA - ratingB || dateB - dateA;
            return ratingB - ratingA || dateB - dateA; // Default: Highest Rated
        });

        // Map to Film interface
        const films = processedItems.slice(0, 10).map((item, index) => {
            const lbItem = item as unknown as LetterboxdItem;
            const ratingValue = lbItem.memberRating;
            const stars = ratingValue ? `${ratingValue}/5.0` : "UNRATED";

            return {
                id: index + 1,
                title: (lbItem.filmTitle || lbItem.title || "Unknown Title").toUpperCase(),
                genres: "WATCHED",
                duration: "00:00",
                rating: stars,
            };
        });

        return NextResponse.json(films);

    } catch (error) {
        console.error("Fetch bill error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while fetching the bill" },
            { status: 500 }
        );
    }
}
