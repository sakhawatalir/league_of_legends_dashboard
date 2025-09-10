import React, { useMemo, useState } from "react";
import DashboardShell from "@/components/Layout/DashboardShell";
import DashboardFilters from "@/components/Dashboard/DashboardFilters";
import DraftStats from "@/components/Dashboard/DraftStats";
import VisionMap from "@/components/Dashboard/VisionMap";
import { GameStats } from "@/components/Dashboard/GameStats";
import { useGetLeagueDataQuery } from "@/generated/hooks";

export default function ScrimsPage() {
  const [selectedSeriesType] = useState<"SCRIM">("SCRIM");
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>("");

  const { data, loading, error } = useGetLeagueDataQuery({
    variables: {
      titleId: "3",
      seriesType: selectedSeriesType,
      windowStartTime: undefined,
      windowEndTime: undefined,
    },
  });

  const series = useMemo(() => {
    return (
      data?.allSeries?.edges
        ?.map((edge) => edge?.node)
        ?.filter((node): node is NonNullable<typeof node> => !!node) || []
    );
  }, [data]);

  return (
    <DashboardShell>
      <div className="p-4 text-white">
        <h1 className="text-3xl font-bold mb-6">Scrim Match Viewer</h1>

        {loading && <p>Loading scrim data...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}

        {!loading && series.length === 0 && (
          <p className="text-yellow-500">
            No Scrim data available for selected filters.
          </p>
        )}

        {/* Loop over each series */}
        {series.map((s, idx) => (
          <div key={idx} className="mb-12">
            <DraftStats series={s} />
            {s.games && <GameStats games={s.games} />}
            {s.visionMap && <VisionMap visionData={s.visionMap} />}
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
