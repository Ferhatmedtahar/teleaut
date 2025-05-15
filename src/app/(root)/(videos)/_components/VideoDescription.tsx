export default function VideoDescription({
  description,
}: {
  description: string | null;
}) {
  if (!description) {
    return null;
  }

  return (
    <div className="mb-8 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-medium mb-2">Description</h2>
      <p className="text-gray-700 whitespace-pre-line">{description}</p>
    </div>
  );
}
