{-# LANGUAGE OverloadedStrings #-}

import System.FSNotify
import Control.Concurrent (threadDelay)
import Control.Monad (forever)
import System.Directory

createThat = createDirectory "./waaat"

main :: IO StopListening 
main =
    withManager $ \mgr -> do
        watchDir
            mgr
            "."
            (const True)
            {- print -}
            (\x -> do
                print x
                createThat)
        forever $ threadDelay 1000000
