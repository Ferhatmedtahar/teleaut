import TeacherCard from "./TeacherCard";

export default async function TeachersListSugguestion({
  userId,
  userClass,
  userBranch,
}: {
  readonly userId: string;
  readonly userClass: string;
  readonly userBranch?: string;
}) {
  const {
    success,
    teachers: suggestedTeachersResponse,
    message,
  } = {
    success: true,
    teachers: [],
    message: "Teachers fetched successfully",
  };

  if (suggestedTeachersResponse?.length === 0) return null;
  return (
    <section>
      {success ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {suggestedTeachersResponse?.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">{message}</p>
      )}
    </section>
  );
}
