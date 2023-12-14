
import { useState } from 'react';
import './App.css';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

const DATA = [
  {
    id: "0e2f0db1-5457-46b0-949e-8032d2f9997a",
    name: "Walmart",
    items: [
      { id: "26fd50b3-3841-496e-8b32-73636f6f4197", name: "3% Milk" },
      { id: "b0ee9d50-d0a6-46f8-96e3-7f3f0f9a2525", name: "Butter" },
    ],
    tint: 1,
  },
  {
    id: "487f68b4-1746-438c-920e-d67b7df46247",
    name: "Indigo",
    items: [
      {
        id: "95ee6a5d-f927-4579-8c15-2b4eb86210ae",
        name: "Designing Data Intensive Applications",
      },
      { id: "5bee94eb-6bde-4411-b438-1c37fa6af364", name: "Atomic Habits" },
    ],
    tint: 2,
  },
  {
    id: "25daffdc-aae0-4d73-bd31-43f73101e7c0",
    name: "Lowes",
    items: [
      { id: "960cbbcf-89a0-4d79-aa8e-56abbc15eacc", name: "Workbench" },
      { id: "d3edf796-6449-4931-a777-ff66965a025b", name: "Hammer" },
    ],
    tint: 3,
  },
];

function App() {
  const [stores, setStores] = useState(DATA);
  const handleDragDrop = (results) => {
    // console.log("dragging and dropping is working now ")
    console.log(results);
    const { destination, source, type } = results;

    //it means we dont have any destination tpo drop the item
    if (!destination) return;

    //it means the source and destination place is same ,it means we drag a element and drop that element at the same place
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'group') {
      const reOrderedStores = [...stores];
      const sourceIdx = source.index;
      const destinationIdx = destination.index;

      //now we will delete the element completly
      const [removedStore] = reOrderedStores.splice(sourceIdx, 1);

      //now  we will add the removed item at destination index without removing anything
      reOrderedStores.splice(destinationIdx, 0, removedStore)
      return setStores(reOrderedStores)
    }

    const storesSourceIdx = stores.findIndex((store) => store.id === source.droppableId);
    const storesDestinationIdx = stores.findIndex(store => store.id === destination.droppableId);
    const newSourceItem = [...stores[storesSourceIdx].items];
    const newDestinationItem = source.droppableId !==
      destination.droppableProps ?
      [...stores[storesDestinationIdx].items] : newSourceItem;

      const [deletedItem]=newSourceItem.splice(source.index,1);
      newDestinationItem.splice(destination.index,0,deletedItem);

      const newStores=[...stores];
      newStores[storesSourceIdx]={
        ...stores[storesSourceIdx],
        items:newSourceItem
      }

      newStores[storesDestinationIdx]={
        ...stores[storesDestinationIdx],
        items:newDestinationItem
      }
      setStores(newStores);
  }
  return (
    <div className="layout__wrapper">
      <div className='card'>
        <DragDropContext onDragEnd={handleDragDrop}>
          <div className='header'>
            <h1>Shopping List</h1>
          </div>
          <Droppable droppableId='root' type='group'>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {stores.map((store, index) => (
                  <Draggable draggableId={store.id} key={store.id} index={index}>
                    {(provided) => (

                      <div  {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                        <StoreList {...store} />

                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

function StoreList({ name, items, id }) {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div className='store-container'>
            <h3>{name}</h3>
          </div>
          <div className='items-container'>
            {items.map((item, index) => (
              <Draggable draggableId={item.id} index={index} key={item.id}>
                {(provided) => (
                  <div className='item-container' {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                    <h4>{item.name}</h4>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export default App;
