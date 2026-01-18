// packages/nextjs/utils/snapshot.ts

const SNAPSHOT_GRAPHQL_URL = "https://hub.snapshot.org/graphql";

export interface Vote {
  id: string;
  created: number;
  choice: any;
  proposal: {
    id: string;
    title: string;
    choices: string[];
    space: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
}

export const fetchVotes = async (voterAddress: string): Promise<Vote[]> => {
  // 1. Normalize address to lowercase (Snapshot requirement)
  const cleanAddress = voterAddress.toLowerCase();

  const query = `
    query Votes {
      votes (
        first: 20
        skip: 0
        where: {
          voter: "${cleanAddress}"
        }
        orderBy: "created",
        orderDirection: desc
      ) {
        id
        created
        choice
        proposal {
          id
          title
          choices
          space {
            id
            name
            avatar
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(SNAPSHOT_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      cache: "no-store", // 👈 CRITICAL FIX: Forces Next.js to fetch fresh data every time
    });

    const data = await response.json();

    // Safety check: ensure data.data.votes exists before returning
    if (data.data && data.data.votes) {
      return data.data.votes;
    } else {
      console.warn("Snapshot API returned no votes structure:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching Snapshot votes:", error);
    return [];
  }
};
