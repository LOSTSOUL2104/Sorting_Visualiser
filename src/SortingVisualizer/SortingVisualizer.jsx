import React from "react";
import { getMergeSortAnimations } from "../sortingAlgorithms/sortingAlgorithms.js";
import "./SortingVisualizer.css";

const ANIMATION_SPEED_MS = 5;
const NUMBER_OF_ARRAY_BARS = 50;
const PRIMARY_COLOR = "turquoise";
const SECONDARY_COLOR = "#f87171";

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(5, 730));
    }
    this.setState({ array });
  }

  mergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    this.animateArrayUpdate(animations);
  }

  quickSort() {
    const animations = [];
    const array = this.state.array.slice();
    quickSortHelper(array, 0, array.length - 1, animations);
    this.animateArrayUpdate(animations);
  }

  heapSort() {
    const animations = [];
    const array = this.state.array.slice();
    heapSortHelper(array, animations);
    this.animateArrayUpdate(animations);
  }

  bubbleSort() {
    const animations = [];
    const array = this.state.array.slice();
    bubbleSortHelper(array, animations);
    this.animateArrayUpdate(animations);
  }

  insertionSort() {
    const animations = [];
    const array = this.state.array.slice();
    insertionSortHelper(array, animations);
    this.animateArrayUpdate(animations);
  }

  selectionSort() {
    const animations = [];
    const array = this.state.array.slice();
    selectionSortHelper(array, animations);
    this.animateArrayUpdate(animations);
  }

  animateArrayUpdate(animations) {
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName("array-bar");
      const [barOneIdx, barTwoIdx, isHeightChange, newHeight] = animations[i];
      setTimeout(() => {
        if (isHeightChange) {
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        } else {
          const barOneStyle = arrayBars[barOneIdx].style;
          const barTwoStyle = arrayBars[barTwoIdx].style;
          const color = i % 2 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }
      }, i * ANIMATION_SPEED_MS);
    }
  }

  render() {
    const { array } = this.state;

    return (
    <div className="array-container">
        <div className="sorting-bars">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                height: `${value}px`,
              }}
            ></div>
          ))}
        </div>
        <div className="controls">
          <button onClick={() => this.resetArray()}>Generate New Array</button>
          <button onClick={() => this.mergeSort()}>Merge Sort</button>
          <button onClick={() => this.quickSort()}>Quick Sort</button>
          <button onClick={() => this.heapSort()}>Heap Sort</button>
          <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
          <button onClick={() => this.insertionSort()}>Insertion Sort</button>
          <button onClick={() => this.selectionSort()}>Selection Sort</button>
        </div>
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function quickSortHelper(array, low, high, animations) {
  if (low < high) {
    const pi = partition(array, low, high, animations);
    quickSortHelper(array, low, pi - 1, animations);
    quickSortHelper(array, pi + 1, high, animations);
  }
}

function partition(array, low, high, animations) {
  const pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    animations.push([j, high, false]);
    animations.push([j, high, false]);
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      animations.push([i, j, true, array[i]]);
      animations.push([j, i, true, array[j]]);
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  animations.push([i + 1, high, true, array[i + 1]]);
  animations.push([high, i + 1, true, array[high]]);
  return i + 1;
}

function heapSortHelper(array, animations) {
  const n = array.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i, animations);
  }

  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    animations.push([0, i, true, array[0]]);
    animations.push([i, 0, true, array[i]]);
    heapify(array, i, 0, animations);
  }
}

function heapify(array, n, i, animations) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && array[left] > array[largest]) largest = left;
  if (right < n && array[right] > array[largest]) largest = right;

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    animations.push([i, largest, true, array[i]]);
    animations.push([largest, i, true, array[largest]]);
    heapify(array, n, largest, animations);
  }
}

function bubbleSortHelper(array, animations) {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push([j, j + 1, false]);
      animations.push([j, j + 1, false]);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        animations.push([j, j + 1, true, array[j]]);
        animations.push([j + 1, j, true, array[j + 1]]);
      }
    }
  }
}

function insertionSortHelper(array, animations) {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0 && array[j - 1] > array[j]) {
      animations.push([j - 1, j, false]);
      animations.push([j - 1, j, false]);
      [array[j - 1], array[j]] = [array[j], array[j - 1]];
      animations.push([j - 1, j, true, array[j - 1]]);
      animations.push([j, j - 1, true, array[j]]);
      j--;
    }
  }
}

function selectionSortHelper(array, animations) {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      animations.push([j, minIdx, false]); // Highlight current bar and the minimum bar
      animations.push([j, minIdx, false]);
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      animations.push([i, minIdx, true, array[i]]);
      animations.push([minIdx, i, true, array[minIdx]]);
    }
  }
}