import { gql, useQuery } from "@apollo/client";

const GET_SCRIMS = gql`
  query GetScrims {
    allSeries(seriesType: "SCRIM") {
      id
      patch
      type
      startTimeScheduled
      teamOne {
        name
        logoUrl
      }
      teamTwo {
        name
        logoUrl
      }
    }
  }
`;

export function useScrimsData() {
  const { data, loading, error } = useQuery(GET_SCRIMS);
  return { data, loading, error };
}
