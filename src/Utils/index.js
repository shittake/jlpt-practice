export const underlineSegment = (sentence, segment) => {
  const startIndex = sentence.indexOf(segment);

  if (startIndex === -1) {
    return sentence;
  }

  const beforeSegment = sentence.slice(0, startIndex);
  const afterSegment = sentence.slice(startIndex + segment.length);

  return (
    <>
      {beforeSegment}
      <span style={{ textDecoration: "underline" }}>{segment}</span>
      {afterSegment}
    </>
  );
};

export const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
