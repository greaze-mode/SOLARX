// src/components/global_accelerator/MentorCard.jsx
import React from "react";

const renderRichText = (richTextArray) => {
  if (!Array.isArray(richTextArray) || richTextArray.length === 0) {
    return <p className="text-gray-600">No content available.</p>;
  }

  return richTextArray.map((block, blockIndex) => {
    const { type, level, children, format } = block;

    // Handle different block types
    switch (type) {
      case "heading":
        const HeadingTag = `h${level}`;
        return (
          <HeadingTag
            key={blockIndex}
            className={`font-bold mb-3 mt-4 ${
              level === 1 ? "text-2xl" : "text-xl"
            }`}
          >
            {children.map((child, i) => child.text)}
          </HeadingTag>
        );

      case "paragraph":
        return (
          <p key={blockIndex} className="">
            {children.map((child, i) => {
              // console.log("Child:", child);
              if (child.bold === true) {
                return <span className="font-bold">{child.text}</span>;
              } else if (child.italic === true) {
                return <span className="italic">{child.text}</span>;
              } else if (child.underline === true) {
                return <span className="underline">{child.text}</span>;
              }
              return child.text;
            })}
          </p>
        );

      case "list":
        const ListTag = format === "ordered" ? "ol" : "ul";
        const listClass =
          format === "ordered"
            ? "list-decimal pl-5 mb-4"
            : "list-disc pl-5 mb-4";

        return (
          <ListTag key={blockIndex} className={listClass}>
            {children.map((item, itemIndex) => (
              <li key={itemIndex} className="mb-1">
                {item.children.map((child, i) => child.text)}
              </li>
            ))}
          </ListTag>
        );

      default:
        return (
          <p key={blockIndex} className=" mb-4">
            {children?.map((child, i) => child.text) || ""}
          </p>
        );
    }
  });
};

const MentorCard = ({ imgSrc, name, title, bio, id }) => {
  return (
    <div
      id={`${id}`}
      className="bg-white flex flex-col rounded-xl shadow-xl hover:shadow-2xl overflow-hidden w-full max-w-[20rem] h-[39rem] flex-shrink-0 transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-200 hover:border-orange-500 focus:border-orange-500"
    >
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-t-xl overflow-hidden">
        <div className="relative h-[17.5rem]">
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-1 text-gray-900">{name}</h3>
        <p className="text-sm font-semibold text-orange-600 mb-3">{title}</p>
        <div className="text-xs md:text-sm leading-relaxed text-gray-700 bio-scrollbar overflow-y-auto flex-grow">
          {renderRichText(bio)}
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
