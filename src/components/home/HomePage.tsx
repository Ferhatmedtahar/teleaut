export default async function HomePage() {
  //fetch the doctors and appointments made by the user
  //  await getHomePageVideos();
  // await getBranchAndClass();
  const { success } = {
    success: true,
  };

  if (!success) {
    return (
      <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
          <p className="dark:text-primary-50/80   ">
            Impossible de charger les vidéos. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg ">
      <div>banner</div>
      <div>appointment</div>
      <div>doctors</div>
    </div>
  );
}
