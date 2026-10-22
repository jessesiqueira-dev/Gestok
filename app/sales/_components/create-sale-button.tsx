"use client";

import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import UpsertSheetContent from "./upsert-sheet-content";
import { ComboboxOption } from "@/app/_components/ui/combobox";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { ProductDto } from "@/app/_data-access/product/get-products";

interface UpsertSaleButtonProps {
  products: ProductDto[];
  productOptions: ComboboxOption[];
}

const UpsertSaleButton = (props: UpsertSaleButtonProps) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [editorInstance, setEditorInstance] = useState(0);

  const handleSheetOpenChange = (open: boolean) => {
    if (open) setEditorInstance((currentInstance) => currentInstance + 1);
    setSheetIsOpen(open);
  };

  return (
    <Sheet open={sheetIsOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <PlusIcon size={20} />
          Nova Venda
        </Button>
      </SheetTrigger>
      <UpsertSheetContent
        key={editorInstance}
        setSheetIsOpen={setSheetIsOpen}
        {...props}
      />
    </Sheet>
  );
};

export default UpsertSaleButton;
