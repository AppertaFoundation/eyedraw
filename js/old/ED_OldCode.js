            
            // Iterates through available classes and produces list
            function doodleClassDetector()
            {
                for (var obj in ED)
                {
                    if (ED.hasOwnProperty(obj) && typeof ED[obj] === 'function')
                    {
                        // Narrow down to objects with a draw function in the prototype
                        if (typeof ED[obj].prototype.draw === 'function')
                        {
                            console.log(obj);
                        }
                    }
                }
            }