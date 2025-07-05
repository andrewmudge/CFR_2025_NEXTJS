const FamilyTree = () => (
  <div className="w-full h-[80vh] overflow-auto rounded-xl border shadow-lg">
    <iframe
      src="/FAMTREE2022_V2.pdf"
      title="Churchwell Family Tree"
      className="w-full h-full"
      style={{ minHeight: 500, minWidth: 500 }}
    />
  </div>
);

export default FamilyTree;