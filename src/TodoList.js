import React, { useState, createRef } from 'react';
import dateformat from 'dateformat';
import useInterval from './useInterval';

function loadItems() {
    try {
        const format = 'd m yyyy';
        const items = JSON.parse(localStorage.getItem('items') || '[]');
        const time = dateformat(new Date(), format);

        const filteredItems = items.filter(item => time === dateformat(item.date, format));
        saveItems(filteredItems);

        return filteredItems;
    } catch (e) {
        return [];
    }
}

function saveItems(items = []) {
    return localStorage.setItem('items', JSON.stringify(items));
}

function createItem(text) {
    const date = new Date().getTime();

    return {
        id: `${date}-${text}`,
        date: date,
        text
    }
}

function timeLeft(date) {
    const seconds = 59 - date.getSeconds();
    const minutes = 59 - date.getMinutes();
    const hours = 23 - date.getHours();
    
    const hoursFormatted = hours < 10 ? `0${hours}` : hours;
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
    const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;

    return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
}

const initalItems = loadItems();

export default function TodoList() {
    const [list, setList] = useState(initalItems);
    const [time, setTime] = useState(new Date());
    const inputItem = createRef();

    const addItem = (e) => {
        e.preventDefault();

        const { value } = inputItem.current;
        if (value.length > 0) {
            const newList = [...list, createItem(value)];
            setList(newList);
            saveItems(newList);
            inputItem.current.value = null;
        }
    }

    const deleteItem = (e) => {
        const id = e.target.getAttribute('data-id');
        const index = list.indexOf(list.find(l => l.id === id));
        list.splice(index, 1);

        setList(list);
        saveItems(list);
    }

    useInterval(() => {
        setTime(new Date());
    }, 1000);

    return <div>
        <header>
            Time till reset: <strong>{timeLeft(time)}</strong>
            <div className="right">
                Total: <strong>{list.length}</strong>
            </div>
        </header>
        
        <form onSubmit={addItem}>
            <input placeholder="Add item..." className="add-input" ref={inputItem}></input>
            <button className="add-button" onClick={addItem}>Add Item</button>
        </form>
        <ul>
        {list.map((item) => (
            <li key={item.date}>
                {item.text}
                <strong>
                    <span className="delete right" data-id={item.id} onClick={deleteItem}>Delete</span>
                </strong>
            </li>    
        ))}
        </ul>
    </div>
}