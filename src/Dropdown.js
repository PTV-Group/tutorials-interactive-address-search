import "./Dropdown.css"
import { useEffect, useState } from "react";

const Dropdown = (props) => {
  const [selectedItem, setSelectedItem] = useState(-1);

  useEffect(() => {
    setSelectedItem(props.selectedItem)
  }, [props.selectedItem]);

  return (
    <div className="dropdown">
      <ul>
        {
          props.suggestions.map((suggestion, index) => {
            return (
              <li
                className={index === selectedItem ? "activeListElement" : "listElement"}
                key={suggestion.caption + suggestion.subCaption}
                onClick={() => props.onClick(suggestion.caption + "," + suggestion.subCaption)}
                onMouseOver={
                  () => {
                    setSelectedItem(index);
                  }
                }
              >
                <p className="caption">{suggestion.caption}</p><p className="subCaption">{suggestion.subCaption}</p>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}

export { Dropdown };