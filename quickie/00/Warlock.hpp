#pragma once

#include <iostream>

class Warlock {
private:
    std::string name;
    std::string title;

    Warlock();
    Warlock(const Warlock &src);
    Warlock &operator=(const Warlock &src);

protected:

public:
    Warlock(const std::string &name_, const std::string &title_);
    ~Warlock();

    const std::string &getName(void) const;
    const std::string &getTitle(void) const;

    void setName(const std::string &name_);
    void setTitle(const std::string &name_);

    void introduce() const;
};