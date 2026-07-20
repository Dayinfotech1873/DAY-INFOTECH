sed -i '/useEffect(() => {/i \  const [visitorCount, setVisitorCount] = useState<number>(0);\n' src/App.tsx
