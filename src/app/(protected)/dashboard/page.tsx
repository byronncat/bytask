'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [lists, setLists] = useState([
    { id: 'list-1', title: 'This is a list', cards: ['card-1', 'card-2'] },
    { id: 'list-2', title: 'Another list', cards: ['card-3'] },
    { id: 'list-3', title: 'Empty list', cards: [] },
  ]);

  const [draggingCard, setDraggingCard] = useState<string | null>(null);
  const [draggingFromList, setDraggingFromList] = useState<string | null>(null);
  const [hoveredListId, setHoveredListId] = useState<string | null>(null);

  const handleDragStart = (cardId: string, sourceListId: string) => {
    setDraggingCard(cardId);
    setDraggingFromList(sourceListId);
  };

  const handleDrop = (destinationListId: string) => {
    if (!draggingCard) return;

    // If dropped into the same list
    if (draggingFromList === destinationListId) {
      setDraggingCard(null);
      setDraggingFromList(null);
      setHoveredListId(null);
      return;
    }

    const newLists = lists.map((list) => {
      if (list.id === draggingFromList) {
        return {
          ...list,
          cards: list.cards.filter((card) => card !== draggingCard),
        };
      }
      if (list.id === destinationListId) {
        return {
          ...list,
          cards: [...list.cards, draggingCard],
        };
      }
      return list;
    });

    setLists(newLists);
    setDraggingCard(null);
    setDraggingFromList(null);
    setHoveredListId(null);
  };

  const handleDragEnter = (listId: string) => {
    setHoveredListId(listId);
  };

  const handleDragLeave = (listId: string) => {
    if (hoveredListId === listId) setHoveredListId(null);
  };

  const addListHandler = () => {
    const newList = { id: `list-${Date.now()}`, title: 'New list', cards: [] };
    setLists([...lists, newList]);
  };

  return (
    <div className="p-6 flex">
      {lists.map((list) => (
        <div
          key={list.id}
          className={`bg-gray-200 p-4 m-2 rounded-lg shadow-md min-w-64 ${
            hoveredListId === list.id ? 'bg-green-200' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(list.id)}
          onDragEnter={() => handleDragEnter(list.id)}
          onDragLeave={() => handleDragLeave(list.id)}
        >
          <h2 className="text-lg font-semibold mb-2">{list.title}</h2>
          <div className="space-y-2">
            {list.cards.map((card) => (
              <div
                key={card}
                draggable
                onDragStart={() => handleDragStart(card, list.id)}
                className="bg-white p-2 rounded shadow cursor-pointer"
              >
                {card}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Button to add a new list */}
      <div
        onClick={addListHandler}
        className="cursor-pointer bg-gray-600 text-white p-2 rounded-lg shadow mt-4 hover:bg-gray-700"
      >
        Add another list
      </div>
    </div>
  );
}

// export default function DashboardPage() {
//   const [lists, setLists] = useState([
//     { id: 'list-1', title: 'This is a list', cards: ['card-1', 'card-2'] },
//     { id: 'list-2', title: 'Another list', cards: ['card-3'] },
//     { id: 'list-3', title: 'Empty list', cards: [] },
//   ]);

//   const [draggingCard, setDraggingCard] = useState<string | null>(null);
//   const [draggingFromList, setDraggingFromList] = useState<string | null>(null);
//   const [hoveredListId, setHoveredListId] = useState<string | null>(null);
//   const [hoverIndex, setHoverIndex] = useState<number | null>(null); // Index for placeholder position

//   const handleDragStart = (cardId: string, sourceListId: string) => {
//     setDraggingCard(cardId);
//     setDraggingFromList(sourceListId);
//   };

//   const handleDragEnter = (listId: string, index: number) => {
//     setHoveredListId(listId);
//     setHoverIndex(index);
//   };

//   const handleDragLeave = () => {
//     setHoveredListId(null);
//     setHoverIndex(null);
//   };

//   const handleDrop = (destinationListId: string) => {
//     if (!draggingCard) return;

//     const newLists = lists.map((list) => {
//       if (list.id === draggingFromList) {
//         // Remove the card from the original list
//         return {
//           ...list,
//           cards: list.cards.filter((card) => card !== draggingCard),
//         };
//       }
//       if (list.id === destinationListId && hoverIndex !== null) {
//         // Insert the card at the hovered index position
//         return {
//           ...list,
//           cards: [
//             ...list.cards.slice(0, hoverIndex),
//             draggingCard,
//             ...list.cards.slice(hoverIndex),
//           ],
//         };
//       }
//       return list;
//     });

//     setLists(newLists);
//     setDraggingCard(null);
//     setDraggingFromList(null);
//     setHoveredListId(null);
//     setHoverIndex(null);
//   };

//   const addListHandler = () => {
//     const newList = { id: `list-${Date.now()}`, title: 'New list', cards: [] };
//     setLists([...lists, newList]);
//   };

//   return (
//     <div className="bg-blue-400 min-h-screen p-6 flex">
//       {lists.map((list) => (
//         <div
//           key={list.id}
//           className={`bg-gray-200 p-4 m-2 rounded-lg shadow-md w-64 ${
//             hoveredListId === list.id ? 'bg-green-200' : ''
//           }`}
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={() => handleDrop(list.id)}
//         >
//           <h2 className="text-lg font-semibold mb-2">{list.title}</h2>
//           <div className="space-y-2">
//             {list.cards.map((card, index) => (
//               <div
//                 key={card}
//                 draggable
//                 onDragStart={() => handleDragStart(card, list.id)}
//                 onDragEnter={() => handleDragEnter(list.id, index)}
//                 onDragLeave={() => handleDragLeave()}
//                 className={`bg-white p-2 rounded shadow cursor-pointer ${
//                   hoveredListId === list.id && hoverIndex === index
//                     ? 'opacity-50'
//                     : ''
//                 }`}
//               >
//                 {card}
//               </div>
//             ))}

//             {/* Render the pseudo-card if hovering */}
//             {hoveredListId === list.id && hoverIndex !== null && (
//               <div
//                 className="bg-blue-300 p-2 rounded shadow opacity-70"
//                 style={{ marginTop: hoverIndex * 36 }} // Adjusts the pseudo-card position visually
//               >
//                 Move here
//               </div>
//             )}
//           </div>
//         </div>
//       ))}

//       {/* Button to add a new list */}
//       <div
//         onClick={addListHandler}
//         className="cursor-pointer bg-gray-600 text-white p-2 rounded-lg shadow mt-4 hover:bg-gray-700"
//       >
//         Add another list
//       </div>
//     </div>
//   );
// }
