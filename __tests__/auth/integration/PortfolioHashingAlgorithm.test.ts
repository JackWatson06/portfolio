
import { PortfolioHashingAlgorithm } from '@/auth/PortfolioHashingAlgorithm' 

test('we get an scrypt hash back from the hashing algorithm.', async () => {
  const portfolio_hashing_algorithm = new PortfolioHashingAlgorithm('testing');

  const hash = await portfolio_hashing_algorithm.hash('testing');

  expect(hash).toBe("51e84db5bf23e20ead584a31a1a6e7673b95331d5c90d20e9991aa52fdaea57268e690b6c14ba303ac19f7d08f2788c1197438dd3979f26f47ea5d260d942524");
})

test('changing the salt changes the hash.', async () => {
  const portfolio_hashing_algorithm = new PortfolioHashingAlgorithm('testing_different_hash');

  const hash = await portfolio_hashing_algorithm.hash('testing');

  expect(hash).not.toBe("51e84db5bf23e20ead584a31a1a6e7673b95331d5c90d20e9991aa52fdaea57268e690b6c14ba303ac19f7d08f2788c1197438dd3979f26f47ea5d260d942524");
});
