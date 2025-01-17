### **What is this?**

First of all, good thing you made it here. This README is about the **Custom Grid Canvas** component.

So, this component is first of all made with help of AI (claude) that `applyapplyPenEffect()` function to be specific and personally, i think the way it works is prettty damn amazing.

### **How does it work?**

The very high level overview of how this **pen effect** works is:

1. we identify the pen's position on the canvas / grid
2. then we want the square that the pen is in to be filled with largest intensity and the squares around it (specified by radius) to be filled with decreasing intensity.
3. we decrease the intensity of squares around the pen's position as the distance from the pen's position increases. so we get that gradient effect.

Now lets look at exact details of how this is implemented:

### Current Pen Position
```javascript
const currentPos = getGridPosition(centerIndex);
```


This line of code gets the current position of the pen on the grid. The `centerIndex` is the index of the square that the pen is in. This is calculated by the `getGridPosition()` function.

```javascript
const getGridPosition = (index: number) => ({
	row: Math.floor(index / GRID_SIZE),
	col: index % GRID_SIZE,
});
```
this is pretty standard method to get the row and column of a square in a grid given its index. i have seen and used this in board games. a good intuition for this could be rows can be understood as something which dividing the grid in `GRID_SIZE` parts and columns can be understood as the offset from the start of the row.

### Interpolate points
```javascript
points = interpolatePoints(lastPos.current, currentPos);
```
this is pretty amazing stuff. this generates all the points between two points to ensure a smooth line is drawn. appearantly, this is called `linear interpolation`.

say, we want to calculate the points between (2, 2) and (4, 5)
1. here we calculate `deltaRow` and `deltaCol` which are the difference between the two points. pretty self explanatory.
2. then we calculate the number of `steps` or `distance` which is maximum of `|deltaRow|` and `|deltaCol|`. this is because we want to ensure that we have enough points to draw a line between the two points.
3. this is where the magic happens.
```javascript
for (let step = 0; step <= distance; step++) {
	const t = distance === 0 ? 0 : step / distance;
	const row = Math.round(start.row + deltaRow * t);
	const col = Math.round(start.col + deltaCol * t);
	points.push({ row, col });
}
```
we calculate the `t` which is the ratio of the current step to the total distance. this sort of denotes how far we are in the journey from start to end.
then we calculate the row and column of the point at this `t` value. this is done by multiplying the `deltaRow` and `deltaCol` by `t` and adding it to the start row and column.
this is done for all the steps between the two points and we get all the points between the two points.

### Apply Pen Effect
The important part of this pen effect is the `radius` and `intensity`. The `radius` is the number of squares around the pen's position that we want to fill with decreasing intensity. The `intensity` is the intensity of the pen's color that we want to fill the squares with.

```javascript
const radius = 2;
const intensity = 0.97;
```

we first of all iterate over all the points that we have calculated between the last position and the current position of the pen.
and then we iterate over all the squares around the pen's position which are supposed to be affected and fill them with the pen's color with decreasing intensity.

```javascript
for(let i = -radius; i <= radius; i++) {
    // body
}
```
this loop makes sense because we want to iterate over affected squares on both sides i.e -ve and +ve offfsets.

Now, for each cell within radius:
1. we calcuate its row and column by adding offsets. and we skip the cells that are outside the grid. (i mean obviously!)
2. we calculate the distance of the cell from the pen's position. this is done using `pythagoras theorem` which is `Math.sqrt(rowDiff * rowDiff + colDiff * colDiff)`.
3. then we calculate effect intensity. the intensity of the pens effect on each cell decreases as the distance increases.

```javascript
const effectIntensity = intensity * (1 - distance / (radius + 1));
```

when `distance = 0`, the effect intensity is equal to the intensity of the pen. as the distance increases and approaches `radius + 1`, the effect intensity approaches 0.

`radius+1` simply ensures that code doesn't break when `radius = 0`.

### Update Grid values
in the end we just update the grid values with the effect intensity making sure that it does not exceed 1.

```javascript
newGrid[index] = Math.min(1, Math.max(newGrid[index], effectIntensity));
```

**And that's it!** This is how the pen effect is applied to the grid. The grid is then used to render the canvas. 

Thank ou for reading this far!