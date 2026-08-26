import React, { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { Puck, Data } from '@measured/puck';
import '@measured/puck/dist/index.css';
import { createPuckConfig, defaultPuckInitialData, Props } from '@/components/shop/builder/puckConfig';
import { Category, Product } from '@/types/shop';

interface HomePageBuilderProps {
  puckData?: Data<Props> | null;
  categories: Category[];
  collections: { id: number; name: string; slug: string }[];
  products: Product[];
}

export default function HomePageBuilder({
  puckData,
  categories = [],
  collections = [],
  products = [],
}: HomePageBuilderProps) {
  const config = useMemo(
    () => createPuckConfig(products, categories, collections),
    [products, categories, collections]
  );

  const initialData: Data<Props> = puckData && puckData.content && puckData.content.length > 0
    ? puckData
    : defaultPuckInitialData;

  const handlePublish = async (data: Data<Props>) => {
    router.post(
      '/admin/pages/home/builder',
      { puck_data: data },
      {
        preserveScroll: true,
        onSuccess: () => {
          // Success flash
        },
        onError: () => {
          alert('Failed to save layout. Please check inputs.');
        },
      }
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0f1117] select-none font-sans">
      <Head title="Theme Customizer — Haarmonaa Fine Jewelry" />

      <Puck
        config={config}
        data={initialData}
        onPublish={handlePublish}
        headerTitle="Haarmonaa Theme Customizer"
        headerPath="/admin/pages"
        iframe={{
          enabled: false,
        }}
        viewports={[
          { width: 1280, height: 'auto', label: 'Desktop', icon: 'monitor' },
          { width: 768, height: 'auto', label: 'Tablet (768px)', icon: 'tablet' },
          { width: 375, height: 'auto', label: 'Mobile (375px)', icon: 'smartphone' },
        ]}
      />
    </div>
  );
}
