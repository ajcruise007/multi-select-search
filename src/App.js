import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pill from "./components/Pill";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersSet, setSelectedUsersSet] = useState(new Set());
  const inputRef = useRef();

  const handleUserClick = (user) => {
    inputRef.current.focus();
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUsersSet(new Set([...selectedUsersSet, user.email]));
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleRemoveUser = (id) => {
    const updatedUsersList = selectedUsers.filter((user) => user.id !== id);
    setSelectedUsers(updatedUsersList);

    // Update in Set
    const updatedEmails = new Set([updatedUsersList.map((user) => user.email)]);
    setSelectedUsersSet(updatedEmails);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }
    fetchUsers(searchQuery);
  }, [searchQuery]);

  const fetchUsers = async (query) => {
    try {
      const res = await fetch(`https://dummyjson.com/users/search?q=${query}`);
      const data = await res.json();
      setSuggestions(data?.users);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {selectedUsers.map((user) => (
          <Pill
            key={user.id}
            text={`${user.firstName} ${user.lastName}`}
            image={user.image}
            onClick={() => handleRemoveUser(user.id)}
          />
        ))}
        <div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && e.target.value === "") {
                if (selectedUsers.length > 0) {
                  handleRemoveUser(selectedUsers[selectedUsers.length - 1].id);
                }
              }
            }}
          />
        </div>
      </div>
      <ul className="suggestions">
        {suggestions.map((user) => {
          return (
            !selectedUsersSet.has(user.email) && (
              <li key={user.id} onClick={() => handleUserClick(user)}>
                <img src={user.image} alt={user.firstName} />
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </li>
            )
          );
        })}
      </ul>
    </div>
  );
}

export default App;
