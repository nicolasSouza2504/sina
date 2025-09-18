"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function KnowledgeTrailsById() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [id, setId] = useState<number>(0);

  useEffect(() => {
    const paramId = params?.id ?? null;

    if (!paramId) {
      router.back();
      return;
    }
    const parsedId = parseInt(paramId, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
      router.back();
      return;
    }

    setId(parsedId);
  }, [params?.id, router]);

  return (
    <div>
      <div>Hello From Knowledge Trail with: {id}</div>

      <button
        onClick={() => router.push(`/admin/knowledgeTrails/${id}/edit`)}
        className="px-3 py-1 border rounded"
      >
        Editar trilha
      </button>
    </div>
  );
}
