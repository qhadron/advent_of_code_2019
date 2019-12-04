# directories for binary fies
OBJDIR=.obj
EXEDIR=.exe

# c++ compile settings
CXX?=clang++
CXXFLAGS=-x c++ -std=c++17 -Wall -Ofast -march=native -flto

# c compile settings
CC?=clang
CCFLAGS=-x c -std=c99 -Wall -Ofast -march=native -flto

# link settings
LDFLAGS=-lpthread -lgmp -flto


# ===============
#      c++
# ===============
.SECONDEXPANSION:
$(OBJDIR)/%.cpp.o: %.cpp $$(wildcard $$*.hpp)
	$(CXX) $(CXXFLAGS) -c -o $@ $<

$(EXEDIR)/%.cpp.run: $(OBJDIR)/%.cpp.o
	$(CXX) $(LDFLAGS) -o $@ $^

%.cpp.run: $(EXEDIR)/%.cpp.run
	$^

# ===============
#       c
# ===============
.SECONDEXPANSION:
$(OBJDIR)/%.c.o: %.c $$(wildcard $$*.h)
	$(CC) $(CCFLAGS) -c -o $@ $<

$(EXEDIR)/%.c.run: $(OBJDIR)/%.c.o
	$(CC) $(LDFLAGS) -o $@ $^

%.c.run: $(EXEDIR)/%.c.run
	$^

# ===============
#     python
# ===============

%.py.run: %.py
	python3 -u $^

# ===============
#   boilerplate
# ===============

# save .o and .run files so no build on unchanged files
.PRECIOUS: $(OBJDIR)/%.cpp.o $(EXEDIR)/%.cpp.run $(OBJDIR)/%.c.o $(EXEDIR)/%.c.run

# remove builtin rules
.SUFFIXES:

.PHONY: clean *.run
clean:
	rm -f $(OBJDIR)/* $(EXEDIR)/*
