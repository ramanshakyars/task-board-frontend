interface SpecialLoaderProps {
  loading: boolean;
  message?: string;
}

function SpecialLoader({
  loading,
  message = "Loading...",
}: SpecialLoaderProps) {

  if (!loading) {
    return null;
  }

  return (
    <div className="text-center p-4">

      <div
        className="spinner-border"
        role="status"
      >
        <span className="visually-hidden">
          Loading...
        </span>
      </div>

      <div className="mt-2">
        {message}
      </div>

    </div>
  );
}

export default SpecialLoader;