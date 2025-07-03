'use client';

import { User, Users } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  generation: number;
  spouse?: string;
  children: string[];
  parents: string[];
  birthYear?: number;
  avatar?: string;
  maidenName?: string;
  isFriendBranch?: boolean; // For friend branches
}

// --- Example data with maiden names and a friend branch ---
const familyMembers: Record<string, FamilyMember> = {
  'patriarch': {
    id: 'patriarch',
    name: 'George Churchwell Sr.',
    generation: 1,
    spouse: 'Mary Churchwell',
    children: ['george-jr', 'robert', 'william'],
    parents: [],
    birthYear: 1920,
  },
  'matriarch': {
    id: 'matriarch',
    name: 'Mary Churchwell',
    maidenName: 'Smith',
    generation: 1,
    spouse: 'George Churchwell Sr.',
    children: ['george-jr', 'robert', 'william'],
    parents: [],
    birthYear: 1925,
  },
  'george-jr': {
    id: 'george-jr',
    name: 'George Churchwell Jr.',
    generation: 2,
    spouse: 'Helen Churchwell',
    children: ['sarah', 'michael'],
    parents: ['patriarch', 'matriarch'],
    birthYear: 1945,
  },
  'helen-churchwell': {
    id: 'helen-churchwell',
    name: 'Helen Churchwell',
    maidenName: 'Johnson',
    generation: 2,
    spouse: 'George Churchwell Jr.',
    children: ['sarah', 'michael'],
    parents: [],
    birthYear: 1947,
  },
  'robert': {
    id: 'robert',
    name: 'Robert Churchwell',
    generation: 2,
    spouse: 'Janet Churchwell',
    children: ['rachelle', 'david'],
    parents: ['patriarch', 'matriarch'],
    birthYear: 1948,
  },
  'janet-churchwell': {
    id: 'janet-churchwell',
    name: 'Janet Churchwell',
    maidenName: 'Baker',
    generation: 2,
    spouse: 'Robert Churchwell',
    children: ['rachelle', 'david'],
    parents: [],
    birthYear: 1950,
  },
  'william': {
    id: 'william',
    name: 'William Churchwell',
    generation: 2,
    spouse: 'Angela Churchwell',
    // Now has 5 kids, including Alex Friend (who is now Gen 2)
    children: ['mackenzie', 'tom', 'friend-branch', 'kid4', 'kid5'],
    parents: ['patriarch', 'matriarch'],
    birthYear: 1950,
  },
  'angela-churchwell': {
    id: 'angela-churchwell',
    name: 'Angela Churchwell',
    maidenName: 'Davis',
    generation: 2,
    spouse: 'William Churchwell',
    // Also lists all 5 kids for consistency
    children: ['mackenzie', 'tom', 'friend-branch', 'kid4', 'kid5'],
    parents: [],
    birthYear: 1952,
  },
  // William's children (Gen 3)
  'mackenzie': {
    id: 'mackenzie',
    name: 'Mackenzie Boone',
    generation: 3,
    children: [],
    parents: ['william'],
    birthYear: 1985,
  },
  'tom': {
    id: 'tom',
    name: 'Tom Churchwell',
    generation: 3,
    children: [],
    parents: ['william'],
  },
  'kid4': {
    id: 'kid4',
    name: 'Taylor Churchwell',
    generation: 3,
    children: [],
    parents: ['william'],
  },
  'kid5': {
    id: 'kid5',
    name: 'Jordan Churchwell',
    generation: 3,
    children: [],
    parents: ['william'],
  },
  // Alex Friend is now Gen 2, spouse Jamie Friend is also Gen 2
  'friend-branch': {
    id: 'friend-branch',
    name: 'Alex Friend',
    generation: 2,
    spouse: 'Jamie Friend',
    children: ['friend-kid'],
    parents: ['william'],
    isFriendBranch: true,
  },
  'jamie-friend': {
    id: 'jamie-friend',
    name: 'Jamie Friend',
    maidenName: 'Taylor',
    generation: 2,
    spouse: 'Alex Friend',
    children: ['friend-kid'],
    parents: [],
    isFriendBranch: true,
  },
  'friend-kid': {
    id: 'friend-kid',
    name: 'Sammy Friend',
    generation: 4,
    children: [],
    parents: ['friend-branch', 'jamie-friend'],
    isFriendBranch: true,
  },
};

function getSpouse(member: FamilyMember) {
  return member.spouse
    ? Object.values(familyMembers).find(m => m.name === member.spouse)
    : undefined;
}

// Helper to avoid rendering both spouses as roots
const renderedSpouses = new Set<string>();

const CoupleCard = ({
  member,
  spouse,
  isFriendBranch,
}: {
  member: FamilyMember;
  spouse?: FamilyMember;
  isFriendBranch?: boolean;
}) => {
  return (
    <div className={`flex flex-row items-center bg-white border border-slate-200 rounded-xl shadow-lg p-4 min-w-[180px] max-w-xs mx-2 relative ${isFriendBranch ? 'ring-2 ring-blue-400' : ''}`}>
      <div className="flex flex-col items-center">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-2
            ${member.generation === 1 ? 'bg-red-500' : ''}
            ${member.generation === 2 ? 'bg-blue-500' : ''}
            ${member.generation === 3 ? 'bg-green-500' : ''}
            ${member.generation > 3 ? 'bg-purple-500' : ''}
            ${isFriendBranch ? 'bg-blue-400' : ''}
          `}
        >
          {isFriendBranch ? <Users className="w-7 h-7 text-white" /> : <User className="w-7 h-7 text-white" />}
        </div>
        <div className="text-center">
          <div className="font-semibold text-slate-800">
            {member.name}
            {member.maidenName && (
              <span className="text-xs text-slate-500 ml-1">
                ({member.maidenName})
              </span>
            )}
          </div>
          {member.birthYear && (
            <div className="text-xs text-slate-500">b. {member.birthYear}</div>
          )}
          <div className="mt-1">
            <span className={`
              text-xs px-2 py-1 rounded-full
              ${member.generation === 1 ? 'bg-red-100 text-red-700' : ''}
              ${member.generation === 2 ? 'bg-blue-100 text-blue-700' : ''}
              ${member.generation === 3 ? 'bg-green-100 text-green-700' : ''}
              ${member.generation > 3 ? 'bg-purple-100 text-purple-700' : ''}
              ${isFriendBranch ? 'bg-blue-100 text-blue-700' : ''}
            `}>
              Gen {member.generation}
            </span>
          </div>
        </div>
      </div>
      {spouse && (
        <>
          <div className="w-8 h-0.5 bg-pink-400 mx-2" />
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-2
                ${spouse.generation === 1 ? 'bg-red-300' : ''}
                ${spouse.generation === 2 ? 'bg-blue-300' : ''}
                ${spouse.generation === 3 ? 'bg-green-300' : ''}
                ${spouse.generation > 3 ? 'bg-purple-300' : ''}
                ${isFriendBranch ? 'bg-blue-300' : ''}
              `}
            >
              {isFriendBranch ? <Users className="w-7 h-7 text-white" /> : <User className="w-7 h-7 text-white" />}
            </div>
            <div className="text-center">
              <div className="font-semibold text-slate-800">
                {spouse.name}
                {spouse.maidenName && (
                  <span className="text-xs text-slate-500 ml-1">
                    ({spouse.maidenName})
                  </span>
                )}
              </div>
              {spouse.birthYear && (
                <div className="text-xs text-slate-500">b. {spouse.birthYear}</div>
              )}
              <div className="mt-1">
                <span className={`
                  text-xs px-2 py-1 rounded-full
                  ${spouse.generation === 1 ? 'bg-red-100 text-red-700' : ''}
                  ${spouse.generation === 2 ? 'bg-blue-100 text-blue-700' : ''}
                  ${spouse.generation === 3 ? 'bg-green-100 text-green-700' : ''}
                  ${spouse.generation > 3 ? 'bg-purple-100 text-purple-700' : ''}
                  ${isFriendBranch ? 'bg-blue-100 text-blue-700' : ''}
                `}>
                  Gen {spouse.generation}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const renderTree = (memberId: string) => {
  const member = familyMembers[memberId];
  if (!member) return null;

  // If this member is a spouse and already rendered, skip
  if (renderedSpouses.has(member.id)) return null;

  const spouse = getSpouse(member);
  if (spouse) renderedSpouses.add(spouse.id);

  const children = member.children.map(childId => familyMembers[childId]).filter(Boolean);

  return (
    <div className="flex flex-col items-center">
      <CoupleCard member={member} spouse={spouse} isFriendBranch={member.isFriendBranch} />
      {children.length > 0 && (
        <div className="flex flex-row justify-center items-start mt-6">
          {children.map(child => (
            <div key={child.id} className="flex flex-col items-center mx-4">
              {/* Friend branch gets a blue connecting line */}
              <div className={`w-0.5 h-6 ${child.isFriendBranch ? 'bg-blue-400' : 'bg-slate-300'}`} />
              {renderTree(child.id)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FamilyTree = () => {
  renderedSpouses.clear(); // Reset before each render
  return (
    <div className="py-12 px-2 bg-gradient-to-br from-slate-50 to-purple-100 min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Churchwell Family Tree</h2>
        <p className="text-slate-600">A horizontal tree layout with partners, maiden names, and friend branches</p>
      </div>
      <div className="flex flex-col items-center">
        {renderTree('patriarch')}
      </div>
      <div className="mt-12 text-center text-xs text-slate-500">
        <span className="inline-block bg-white px-4 py-2 rounded shadow">
          <b>Legend:</b> <span className="text-red-500">Red</span> = Founders, <span className="text-blue-500">Blue</span> = 2nd Gen, <span className="text-green-500">Green</span> = 3rd Gen, <span className="text-purple-500">Purple</span> = 4th+
        </span>
      </div>
    </div>
  );
};

export default FamilyTree;