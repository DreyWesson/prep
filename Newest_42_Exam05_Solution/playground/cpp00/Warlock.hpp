#ifndef WARLOCK_HPP
# define WARLOCK_HPP

#include <iostream>

class Warlock
{
private:
    std::string name;
    std::string title;

    Warlock();
    Warlock(const Warlock &src);
    Warlock &operator=(const Warlock &src);

public:
    Warlock(const std::string &name, const std::string &title);
    ~Warlock();

    void setName(const std::string &name_);
    void setTitle(const std::string &title_);

    const std::string &getName(void) const;
    const std::string &getTitle(void) const;
    void introduce() const;
};



#endif