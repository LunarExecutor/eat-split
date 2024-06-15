import './index.css';
import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({children, onClick}) {
  return <button className='button' onClick={onClick}>{children}</button>;
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(show => !show);
  }

  function handleAddFriend(friend) {
    setFriends(friends => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    //setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends(friends => friends.map(friend => friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value} : friend));

    setSelectedFriend(null);
    }

  return (
  <div className="app">
    <div className='sidebar'>
    <FriendsList friends={friends} onSelection={handleSelection} selectedFriend={selectedFriend}/>

    {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend}/>}
    <Button onClick={handleShowAddFriend}>{showAddFriend ? "Close" : "Add friend"}</Button> 
    </div> 

    {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitFriend={handleSplitBill}/>}
  </div>

  );
}

function FriendsList({friends, onSelection, selectedFriend}) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} selectedFriend={selectedFriend} onSelection={onSelection}/>
      ))}
    </ul>
  );
}

function Friend({friend, onSelection, selectedFriend}) {
      const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src= {friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      
      {friend.balance < 0 && <p className='red'>You owe {friend.name} {Math.abs(friend.balance)}$</p>}
      {friend.balance > 0 && <p className='green'>{friend.name} owes you {friend.balance}$</p>}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  );
}

function FormAddFriend({onAddFriend}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
  }
  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>👩🏻Friend name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)}/>

      <label>🌇 Image URL</label>
      <input type="text" value={image} onChange={e => setImage(e.target.value)}/>

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({selectedFriend, onSplitFriend}) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState('');
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState('user');

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitFriend(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
  }


  return <form className='form-split-bill' onSubmit={handleSubmit}>
    <h2>Split bill with {selectedFriend.name}</h2>
    <label>💰 Bill value</label>
    <input type="text" value={bill} onChange={e => setBill(Number(e.target.value))} />

    <label>👩🏻Your expense</label>
    <input type="text" value={paidByUser} 
    onChange={e => setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))}/>

    <label>🧑‍🤝‍🧑{selectedFriend.name}'s expense:</label>
    <input type="text" disabled value={paidByFriend}/>

    <label>🤑 Who is paying the bill?</label> 
    <select value={whoIsPaying} onChange={e => setWhoIsPaying(e.target.value)}>
      <option value='user' >You</option>
      <option value='friend'>{selectedFriend.name}</option>
    </select>

    <Button>Split bill</Button>
  </form>
}


/*What the important concepts i learned from this project?

  1. State management, ex: useState

  2. Component structure, ex: Parent and children

  3. Props and state, ex: Props: Props are used to pass data and functions from parent components to child components.
   For instance, FriendsList receives the list of friends and a function to handle friend selection.

  4. Event handling, ex: onClick or onChange or onSubmit

  5. Conditional rendering, ex: ternary operator 
  {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend}/>}

  6. Controlled components, ex:<input type="text" value={name} onChange={e => setName(e.target.value)}/>

  7. Reusability, ex: button component that can be used in multiple places
  <Button onClick={() => onSelection(friend)}>{isSelected ? "Close" : "Select"}</Button>

  8. Derived state, ex: const paidByFriend = bill ? bill - paidByUser : "";

  9. Conditional CSS classes, ex: <li className={isSelected ? "selected" : ""}>

  10. Forms and validation, ex: function handleSubmit(e) {
  e.preventDefault();
  if (!name || !image) return;
  ...
}
 
  */