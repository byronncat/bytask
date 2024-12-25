import { Container } from './';

export default function FetchingBoards() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <Container
          key={index}
          className="bg-surface-1 animate-pulse"
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </>
  );
}
