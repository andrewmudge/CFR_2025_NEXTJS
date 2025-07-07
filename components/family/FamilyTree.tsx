const FamilyTree = () => (
  <div className="w-full h-[80vh] overflow-auto rounded-xl border shadow-lg">
    <iframe
      src="/FamilyTree.html"
      title="Churchwell Family Tree"
      className="w-full h-full"
      style={{ minHeight: 500, minWidth: 500, border: 'none' }}
    />
  </div>
);

export default FamilyTree;