import { Form } from "react-router";
import type { Route } from "./+types/home";
import { db } from "~/db";
import { projects } from "~/db/schema"; // Şemayı import etmelisin
import { desc } from "drizzle-orm";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const repoUrl = formData.get("repoUrl") as string;

  if (!repoUrl) return { error: "Link gerekli" };

  // URL'den owner ve name ayıklama
  const cleanUrl = repoUrl.replace("https://github.com/", "").replace(/\/$/, "");
  const [owner, name] = cleanUrl.split("/");

  if (!owner || !name) return { error: "Geçersiz GitHub linki" };

  try {
    // DRIZZLE INSERT
    const [newProject] = await db.insert(projects).values({
      owner,
      name,
      description: `${owner}/${name} projesi`,
    }).returning();

    return { success: true, project: newProject };
  } catch (error) {
    console.error("Drizzle Hatası:", error);
    return { error: "Proje eklenirken bir hata oluştu." };
  }
}

export async function loader() {
  try {
    // DRIZZLE SELECT (Bounties ilişkisi için şemada relation tanımlı olmalı, 
    // şimdilik en temel haliyle çekiyoruz)
    const allProjects = await db.query.projects.findMany({
      with: {
        bounties: true, // Şemada relations tanımladıysan çalışır
      },
      orderBy: [desc(projects.createdAt)],
    });

    return { projects: allProjects };
  } catch (error) {
    console.error("Loader Hatası:", error);
    return { projects: [] };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Issue Scout 🕵️‍♂️</h1>

      <Form method="post" className="mb-8 p-4 border rounded bg-gray-50">
        <label className="block mb-2 font-medium">GitHub Repo Linki:</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="repoUrl"
            placeholder="https://github.com/facebook/react"
            className="flex-1 p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Projeyi Takip Et
          </button>
        </div>
      </Form>

      <h2 className="text-xl font-semibold mb-4">Takip Edilen Projeler</h2>
      <div className="space-y-3">
        {projects.length === 0 && (
          <p className="text-gray-500 italic">Henüz hiçbir proje eklemedin.</p>
        )}
        {projects.map((project: any) => (
          <div key={project.id} className="p-3 border rounded shadow-sm bg-white flex justify-between items-center">
            <div>
              <span className="font-bold text-blue-600">{project.owner}</span>
              <span className="text-gray-400"> / </span>
              <span className="font-medium">{project.name}</span>
            </div>
            <span className="text-xs text-gray-400">
              {project.bounties?.length || 0} görev
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}