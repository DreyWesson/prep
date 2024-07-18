#include "Warlock.hpp"

int main()
{
  std::cout << std::endl;
  std::cout << std::endl;
  std::cout << std::endl;
  Warlock const richard("Richard", "Mistress of Magma");
  richard.introduce();
  std::cout << richard.getName() << " - " << richard.getTitle() << std::endl;

  Warlock* jack = new Warlock("Jack", "the Long");

  jack->introduce();
  jack->setTitle("the Mighty");
  jack->introduce();

  delete jack;

  std::cout << std::endl;
  std::cout << std::endl;
  std::cout << std::endl;
  return (0);
}