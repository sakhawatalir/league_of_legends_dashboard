import DashboardShell from "@/components/Layout/DashboardShell";

const soloq = () => {
  return <div>soloq Page</div>;
};

soloq.getLayout = (page: React.ReactNode) => (
  <DashboardShell>{page}</DashboardShell>
);

export default soloq;
