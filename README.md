# A Tale of Two Goblins

**An Attempted Murder Mystery**  
_**Game Design**_

*Website:* <https://thackis.net/games/a-tale-of-two-goblins>  
*Prototype:* <https://ataleoftwogoblins.com>  
*Source:* <https://github.com/Thackis/ataleoftwogoblins>

### Summary
A Tale of Two Goblins is a short 2D retro styled point and click adventure mystery game.

You play the role of a detective looking into the mysterious 40th story fall, and survival, of The Master Goblin. You get a chance to explore Goblin Garage Studios, uncover the companies secrets and witness the dynamic clash between The Master Goblin and The Goblin Mastermind.

Think spy vs spy meets the board game Clue.

The goal was to setup the player character to be a continuing protagonist through a series of similar short games (think Poirot, Murder She Wrote, etc).

The game is supposed to be comedic in nature. Similar to old LucasArts or Sierra Adventure games.


### Personal Reflection
I loved coming up with this story. It was a great spoof off of my attempted game development studio, Goblin Garage Studios. The "Goblin Duo" represented different aspects of my personality and the internal struggles they cause.


### Story / Background
The story is based off a "war" between The Master Goblin and The Goblin Mastermind, two halves of the same whole. The duo crated and run a game development studio but are always at odds with each other (and thus nothing gets done). The Master Goblin was making a play to oust The Goblin Mastermind in order to finish a product but someone made an attempt on his life!

The story of the game centers on a detective assigned to the case who must talk to all the members of the staff, including The Goblin Mastermind and The Master Goblin (who shows up halfway through the game from the hospital), search for clues, and ultimately perform a full room "reveal" and accusation! Success gets the standard detective story style of ending, failure gets the detective shot.


### The Look
A classic or retro pixel art style. Each character has a "primary" color to help differentiate amongst the cast and dialogue.


### Play Time
1 to 2 hours per game, but probably less.


### Cast
- Detective
- Receptionist
- Archivist
- Developer
- Janitor
- The Master Goblin
- The Goblin Mastermind

### Example Narrative Scene

*The Goblin Mastermind*:  
> "So, Mister Goblin. You're alive. Tell me, how is it you survived that fall?"

*The Master Goblin*:  
> "You see, it's a long story..."  
> as he sits on the edge of The Goblin Mastermind's desk.

*The Goblin Mastermind*:  
> Scowling even more...  
> "Do make this short Mister Goblin. I hate your incessant monologues..."


### Game Mechanics

#### Graphical User Interface
Interactable objects highlight when you mouse over. Simply click on them to interact.

Press a key (such as z) to highlight everything visible that is interactable.

#### Journal
The Journal is a place where the character keeps all of their notes, thoughts, and evidence. It is used as both reference and investigation by the player.
	
New notes appear automatically when you discover something.

#### Dialogue
Dialogue only happens once, unless there is a reason for that dialogue option to remain. Any relevant information that comes up during a dialogue is noted in your Journal.

#### Randomization
Each play through has a random attempted murderer, with an associated random set of facts, as well as a random attempted murder weapon.

#### Accusation
You can only accuse someone when you have obtained enough evidence. This is to prevent random guessing.

If you guess wrong, the lights go out, you get shot, and the attempted murderer escapes. You will wake up in the hospital, pink slip on the bedside table, and *Achievement unlocked*: Terminated.

### Alternative Game Mechanic Concepts
Below are additional Game Mechanic ideas that I never fully vetted or decided if they should go into this game.

- Develop dialogues based on a "personality" and assign each personality randomly to a character. These personalities change on each play thru. This can lead to interesting and varying things such as gay or transgender characters.

- Rudimentary RPG Style:
	- Pick your character (from the cast sans the goblin duo).
	- Basic skills you can pick at start of each game.
	- Skills would be things like Charm, Persuasion, Research, Slight of Hand, etc.
	- Each character starts with unique base skills and some points to customize.
	- Success on a topic automatically increases a skill 1 point.
	- Discussions with NPCs are like "encounters."
	- Random check for success plus your skill level, similar to a dice roll in a tabletop game.
	- Win the "encounter" and you get something (clue, fact, hint, etc).
	- Skills help certain choices and situations/paths.
	
### Unfinished Prototype
I created a crude prototype for this game as the header for the studio website. I kept it around since I really liked how it turned out, even incomplete as it is. This prototype was created before a lot of this design was done and in a way, it's an early version of this concept. As such, there is not much functionality. Just sprites that move around, cool environmental effects, and some dialogue.
	
*Play:* <http://ataleoftwogoblins.com>  
*Source:* <https://github.com/Thackis/ataleoftwogoblins>


### Technical Aspects of the Prototype

#### Full Width Background
Due to the nature of the web, it's really easy to expand things to fill up available space. So, while there is an invisible set width box in which the player can not move out of, the background or "set", expands to fill the browser. This can be done with repeatable graphics or a very long background graphic. This provides an interesting look, especially given the high-rise business office location for the game.

#### Rain
I took a small repeatable tile, used that to fill up the background of a container, and moved that container downwards at a set rate. Once it got down a certain amount I would reset it's location and start over. This gave the impression of falling rain.

#### Reflections
The reflection is simply baked into the sprites using alpha transparency and opacity. To get the rain to work, I simply reversed the technique I used for the rain in general, and then put an opacity onto that container to give it a more subdued effect.

I originally tried to do the reflection in real-time, but the frame rate was very bad in some browsers and so I worked around it this way. Keep in mind this was early 2010's, so today you could do this technique more accurately and in real-time without a hitch.

#### Lightning
The lightning effect is simply done on a timer. Ever so often, all of the sprites will be replaced with a silhouette version (usually black, but the windows are white for the lightning itself) for a split second. Then they are all flipped back to normal and the timer is randomly reset.


### Copyright
<http://creativecommons.org/licenses/by/4.0/>  
A Tale of Two Goblins is licensed under a Creative Commons Attribution 4.0 International License.

In essence you are free to use and/or modify anything from this design. This including the prototype code, story, names and titles, designs, art, and game mechanics. The only stipulation is that you give appropriate credit where due. Please see the link above to obtain further information on the license.

### Where This is Used
If you use any of this design, please let me know. I would love to see how anything is used. I will also include a link here to your work.
