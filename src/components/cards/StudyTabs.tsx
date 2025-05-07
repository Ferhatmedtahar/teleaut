// app/etude/components/StudyTabs.tsx
import EtudesButton from "../buttons/MesEtudesButtons";
import ProfessorsButton from "../buttons/ProfessorsButton";

type Props = {
  activeTab: "etudes" | "professors";
  setActiveTab: (tab: "etudes" | "professors") => void;
};

export default function StudyTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="inline-flex rounded-md overflow-hidden border border-gray-300">
      <EtudesButton
        isActive={activeTab === "etudes"}
        onClick={() => setActiveTab("etudes")}
      />
      <ProfessorsButton
        isActive={activeTab === "professors"}
        onClick={() => setActiveTab("professors")}
      />
    </div>
  );
}
