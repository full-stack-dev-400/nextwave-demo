import { ServicesSequence } from "@/components/home/ServicesSequence";

import { SelectedWorkShowcase } from "@/components/home/SelectedWorkShowcase";
import { SystemsInMotion } from "@/components/home/SystemsInMotion";

export default function Home() {
  return (
    <>
      <ServicesSequence />

      <SelectedWorkShowcase />
      <SystemsInMotion />
    </>
  );
}
