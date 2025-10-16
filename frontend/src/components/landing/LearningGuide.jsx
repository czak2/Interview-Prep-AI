import React from "react";
import { X, Copy } from "lucide-react";

const LearningGuide = ({ onClose }) => {
  return (
    <div className="w-96 bg-white rounded-lg shadow-md border border-gray-200 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          CSS Flexbox: A Beginner's Guide
        </h3>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          CSS Flexbox is a powerful layout model in CSS. It's designed to make
          it easier to design flexible and responsive web page layouts without
          having to rely on floats or positioning. Think of it as a way to
          organize and distribute space among items in a container (the parent
          element) to best fit the available space, or to display elements in
          the right way regardless of your screen size.
        </p>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Basic Concepts:</h4>

          <div className="space-y-4">
            <div>
              <div className="flex items-start space-x-2 mb-2">
                <span className="font-medium text-sm">1</span>
                <span className="font-medium text-gray-900 text-sm">
                  Flex Container:
                </span>
              </div>
              <p className="text-gray-600 text-sm ml-4">
                This is the parent element. You make an element a flex container
                by setting{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  display: flex;
                </code>{" "}
                or{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  display: inline-flex;
                </code>{" "}
                on it. All direct children of this container become flex items.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-600">CSS</span>
                <Copy className="w-3 h-3 text-gray-400" />
              </div>
              <pre className="text-xs text-gray-800">
                {`.container {
  display: flex;
}`}
              </pre>
            </div>

            <div>
              <div className="flex items-start space-x-2 mb-2">
                <span className="font-medium text-sm">2</span>
                <span className="font-medium text-gray-900 text-sm">
                  Flex Items:
                </span>
              </div>
              <p className="text-gray-600 text-sm ml-4">
                These are the direct children of the flex container. Flexbox
                controls the layout of these items.
              </p>
            </div>

            <div>
              <div className="flex items-start space-x-2 mb-2">
                <span className="font-medium text-sm">3</span>
                <span className="font-medium text-gray-900 text-sm">
                  Main Axis:
                </span>
              </div>
              <p className="text-gray-600 text-sm ml-4">
                This is the primary axis of the flex container. By default, the
                main axis is horizontal (left to right).
              </p>
            </div>

            <div>
              <div className="flex items-start space-x-2 mb-2">
                <span className="font-medium text-sm">4</span>
                <span className="font-medium text-gray-900 text-sm">
                  Cross Axis:
                </span>
              </div>
              <p className="text-gray-600 text-sm ml-4">
                This axis runs perpendicular to the main axis. If the main axis
                is horizontal, the cross axis is vertical (top to bottom).
              </p>
            </div>

            <div>
              <div className="flex items-start space-x-2 mb-2">
                <span className="font-medium text-sm">5</span>
                <span className="font-medium text-gray-900 text-sm">
                  flex-direction:
                </span>
              </div>
              <p className="text-gray-600 text-sm ml-4">
                This property defines the direction of the main axis. Common
                values are:
              </p>
              <div className="ml-4 mt-2 space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <code className="bg-gray-100 px-1 rounded">row</code>
                  <span className="text-gray-600">
                    (default): Horizontal, items are displayed left to right
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <code className="bg-gray-100 px-1 rounded">row-reverse</code>
                  <span className="text-gray-600">
                    : Horizontal, items are displayed right to left
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningGuide;
