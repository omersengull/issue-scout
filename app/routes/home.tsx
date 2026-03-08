import { Form, useLoaderData } from "react-router";
import type { Route } from "./+types/home";
import { PrismaClient } from "@prisma/client";

// PrismaClient'ın her reload'da yeni bağlantı açmasını engellemek için dışarıda tanımlıyoruz
const prisma = new PrismaClient();

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const repoUrl = formData.get("repoUrl") as string;

  if (!repoUrl) return { error: "Link gerekli" };

  // URL'den owner ve name ayıklama (Daha güvenli hale getirdik)
  const cleanUrl = repoUrl.replace("https://github.com/", "").replace(/\/$/, "");
  const [owner, name] = cleanUrl.split("/");

  if (!owner || !name) return { error: "Geçersiz GitHub linki" };

  const project = await prisma.project.create({
    data: { 
      owner, 
      name, 
      description: `${owner}/${name} projesi` 
    },
  });

  return { success: true, project };
}

export async function loader() {
  const projects = await prisma.project.findMany({
    include: { bounties: true },
    orderBy: { createdAt: "desc" } // En yeni eklenen en üstte
  });
  return { projects };
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
          {/* HATA BURADAYDI: </div> yerine </button> olmalı */}
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
        {projects.map((project:any) => (
          <div key={project.id} className="p-3 border rounded shadow-sm bg-white flex justify-between items-center">
            <div>
              <span className="font-bold text-blue-600">{project.owner}</span>
              <span className="text-gray-400"> / </span>
              <span className="font-medium">{project.name}</span>
            </div>
            <span className="text-xs text-gray-400">
              {project.bounties.length} görev
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}