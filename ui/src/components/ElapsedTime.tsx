import { useNow } from "../hooks/useNow";
import { formatDateTime, formatElapsed } from "../utils/time";

function ElapsedTime({ since }: { since: string }) {
  const now = useNow();

  return (
    <time dateTime={since} title={formatDateTime(since)}>
      {formatElapsed(now - new Date(since).getTime())}
    </time>
  );
}

export default ElapsedTime;
