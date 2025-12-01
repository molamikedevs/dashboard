export default function ErrorInput({
  message,
  id,
}: {
  message?: string;
  id?: string;
}) {
  if (!message) return null;

  return (
    <p id={id} className="text-red-600 text-sm mt-1">
      {message}
    </p>
  );
}
