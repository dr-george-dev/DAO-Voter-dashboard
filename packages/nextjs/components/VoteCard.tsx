// packages/nextjs/components/VoteCard.tsx
import { Vote } from "~~/utils/scaffold-eth/snapshot";

export const VoteCard = ({ vote }: { vote: Vote }) => {
  // 1. HELPERS: Format the raw data

  // Format Date (UNIX timestamp is in seconds, JS needs milliseconds)
  const date = new Date(vote.created * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Parse Choice: Snapshot returns an index (1-based), we need the text text from the proposal
  // Example: choice = 1, proposal.choices = ["Yes", "No"] -> Result: "Yes"
  let choiceLabel = vote.choice;
  if (typeof vote.choice === "number" && vote.proposal.choices) {
    // Subtract 1 because arrays are 0-indexed but Snapshot is 1-indexed
    choiceLabel = vote.proposal.choices[vote.choice - 1] || vote.choice;
  }

  // 2. THE UI: A clean DaisyUI Card
  return (
    <div className="card w-full bg-base-100 shadow-xl border border-base-300 hover:border-primary transition-colors duration-200">
      <div className="card-body p-5">
        {/* HEADER: DAO Info */}
        <div className="flex items-center gap-3 mb-2">
          {/* Avatar with fallback */}
          <div className="avatar">
            <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {vote.proposal.space.avatar ? (
                <img src={`https://cdn.stamp.fyi/space/${vote.proposal.space.id}?s=64`} alt="DAO" />
              ) : (
                <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center text-xs">
                  ?
                </div>
              )}
            </div>
          </div>
          <span className="font-bold text-sm text-gray-400 uppercase tracking-wider">{vote.proposal.space.name}</span>
          <span className="ml-auto text-xs text-gray-500">{date}</span>
        </div>

        {/* BODY: Proposal Title */}
        <h3 className="card-title text-lg leading-tight mb-4">{vote.proposal.title}</h3>

        {/* FOOTER: The Vote Choice (Fixed for long text) */}
        <div className="card-actions justify-end items-center mt-auto border-t border-base-200 pt-3 w-full">
          <span className="text-xs text-gray-500 mr-2 shrink-0">You voted:</span>

          {/* FIX: Added 'max-w', 'truncate', and 'title' */}
          <div
            className="badge badge-primary badge-outline font-bold p-3 max-w-[60%] truncate"
            title={String(choiceLabel)} // <--- Tooltip on hover
          >
            {String(choiceLabel).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
