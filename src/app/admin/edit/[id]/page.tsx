import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { lessons } from "@/data/lessons";
import { getLessonFromBlob } from "@/lib/storage";
import LessonEditor from "./LessonEditor";

export const dynamic = "force-dynamic";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin");

  const { id } = await params;
  const staticData = lessons[id];

  if (!staticData) {
    redirect("/admin/dashboard");
  }

  // Try blob first
  let lessonData = null;
  let source = "static";
  try {
    const blobData = await getLessonFromBlob(id);
    if (blobData) {
      lessonData = blobData;
      source = "blob";
    }
  } catch {
    // Blob not available, use static
  }

  if (!lessonData) {
    lessonData = { ...staticData };
  }

  return (
    <LessonEditor
      id={id}
      initialData={JSON.parse(JSON.stringify(lessonData))}
      source={source}
    />
  );
}
