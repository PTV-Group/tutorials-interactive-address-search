import "./SearchInput.css"

import { useEffect, useState } from "react";

import { Dropdown } from "./Dropdown"

const suggestRequest = (input, apiKey) => `https://api.myptv.com/geocoding/v1/suggestions/by-text?searchText=${input}&apiKey=${apiKey}`;
const geocodeRequest = (input, apiKey) => `https://api.myptv.com/geocoding/v1/locations/by-text?searchText=${input}&apiKey=${apiKey}`;


const SearchInput = (props) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(-1);

  const scrollDown = () => {
    const newSelectedItem =
      selectedItem < suggestions.length - 1 ? selectedItem + 1 : selectedItem;
    setSelectedItem(newSelectedItem);
  };

  const scrollUp = () => {
    if (selectedItem !== -1) {
      setSelectedItem(selectedItem - 1);
    }
  };

  const showDropdown = () => {
    setDropdownVisible(true);
    setSelectedItem(-1);
  }

  const hideDropdown = () => {
    setDropdownVisible(false);
    setSelectedItem(-1);
  }

  const suggest = (input) => {
    fetch(
      suggestRequest(input, props.apiKey)
    ).then(
      response => response.json()
    ).then(({ suggestions }) => {
      setSuggestions(suggestions?.slice(0, props.maximumNumberOfSuggestions));
    });
  }

  const geocode = (input) => {
    fetch(
      geocodeRequest(input, props.apiKey)
    ).then(
      response => response.json()
    ).then(({ locations }) => {
      props.onSearch(locations);
    });
  }

  const handleSearchInput = (event) => {
    setInput(event.target.value);
    suggest(event.target.value);
  }

  const handleKeyboardNavigation = (event) => {
    switch (event.nativeEvent.code) {
      case "Enter":
        event.preventDefault();
        let address = input;
        if (selectedItem !== -1) {
          address = suggestions[selectedItem].caption + "," + suggestions[selectedItem].subCaption;
          setInput(address);
        }
        geocode(address);
        hideDropdown();
        break;
      case "Escape":
        event.preventDefault();
        hideDropdown();
        break;
      case "ArrowDown":
        event.preventDefault();
        scrollDown();
        break;
      case "ArrowUp":
        event.preventDefault();
        scrollUp();
        break;
    }
  }

  useEffect(() => {
    if (suggestions && suggestions.length > 0) {
      showDropdown()
    } else {
      hideDropdown();
    }
  }, [suggestions]);

  return (
    <>
      <input
        value={input}
        className="input"
        type="text"
        placeholder="Enter an address"
        autoFocus={true}
        onKeyDown={(event) => handleKeyboardNavigation(event)}
        onChange={(event) => handleSearchInput(event)}
      />
      {dropdownVisible && (
        <Dropdown
          suggestions={suggestions}
          selectedItem={selectedItem}
          onClick={
            (input) => {
              hideDropdown();
              setInput(input);
              geocode(input);
            }
          }
        />)}
    </>
  );
}

export { SearchInput };