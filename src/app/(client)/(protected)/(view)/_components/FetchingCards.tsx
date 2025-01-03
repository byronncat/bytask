import Container from './Container';

export default function FetchingBoards() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <Container
          key={index}
          className="bg-foreground animate-pulse"
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </>
  );
}
